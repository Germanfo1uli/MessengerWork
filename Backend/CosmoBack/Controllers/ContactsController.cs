using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactsController(IContactService contactService)
        {
            _contactService = contactService ?? throw new ArgumentNullException(nameof(contactService));
        }

        [HttpPost]
        public async Task<IActionResult> AddContact([FromBody] AddContactRequest request)
        {
            try
            {
                var contact = await _contactService.AddContactAsync(request.OwnerId, request.ContactId, request.Tag);
                return Ok(contact);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{contactId}")]
        public async Task<IActionResult> RemoveContact(Guid contactId)
        {
            try
            {
                await _contactService.RemoveContactAsync(contactId);
                return Ok("Контакт удален");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserContacts(Guid userId)
        {
            try
            {
                var contacts = await _contactService.GetUserContactsAsync(userId);
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{contactId}/tag")]
        public async Task<IActionResult> UpdateContactTag(Guid contactId, [FromBody] string newTag)
        {
            try
            {
                await _contactService.UpdateContactTagAsync(contactId, newTag);
                return Ok("Тег контакта обновлен");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class AddContactRequest
    {
        public Guid OwnerId { get; set; }
        public Guid ContactId { get; set; }
        public string? Tag { get; set; }
    }
}